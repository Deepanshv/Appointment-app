const { PrismaClient } = require("@prisma/client");
const { addDays, set, formatISO, startOfDay } = require("date-fns");

const prisma = new PrismaClient();

exports.getAvailableSlots = async (req, res) => {
  try {
    // Get slots for the next 7 days starting from today
    const from = startOfDay(new Date());
    const to = addDays(from, 7);

    // Fetch all bookings within this 7-day range
    const bookedSlots = await prisma.booking.findMany({
      where: {
        slotId: {
          gte: from.toISOString(),
          lt: to.toISOString(),
        },
      },
      select: { slotId: true },
    });
    const bookedSlotIds = new Set(bookedSlots.map((b) => b.slotId));

    const availableSlots = [];
    let currentDate = from;
    // Loop through each of the next 7 days
    for (let i = 0; i < 7; i++) {
      // Generate slots from 9:00 to 16:30
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotStart = set(currentDate, {
            hours: hour,
            minutes: minute,
            seconds: 0,
            milliseconds: 0,
          });
          const slotId = formatISO(slotStart);

          // Only include slots that are in the future and not already booked
          if (slotStart > new Date() && !bookedSlotIds.has(slotId)) {
            availableSlots.push({ id: slotId, start_at: slotId });
          }
        }
      }
      currentDate = addDays(currentDate, 1);
    }

    res.json(availableSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch slots." });
  }
};

exports.bookSlot = async (req, res) => {
  const { slotId } = req.body;
  const userId = req.user.id; // from authenticateToken middleware

  try {
    const newBooking = await prisma.booking.create({
      data: { userId, slotId },
    });
    res.status(201).json(newBooking);
  } catch (error) {
    if (error.code === "P2002") {
      // Unique constraint violation from schema
      return res
        .status(409)
        .json({
          error: {
            code: "SLOT_TAKEN",
            message: "This slot is no longer available.",
          },
        });
    }
    res
      .status(500)
      .json({
        error: { code: "SERVER_ERROR", message: "Could not create booking." },
      });
  }
};

exports.getMyBookings = async (req, res) => {
  const userId = req.user.id;
  const bookings = await prisma.booking.findMany({
    where: { userId },
    orderBy: { slotId: "asc" },
  });
  res.json(bookings);
};

exports.getAllBookings = async (req, res) => {
  const bookings = await prisma.booking.findMany({
    include: { user: { select: { name: true, email: true } } }, // Include patient info
    orderBy: { slotId: "asc" },
  });
  res.json(bookings);
};
