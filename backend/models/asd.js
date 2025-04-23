//@route  GET /api/book/genres
//@desc   Get all unique genres (categories)
//@access Public
router.get('/genres', async (req, res) => {
  try {
    const genres = await Book.distinct('category')
    res.status(200).json({ message: 'Genres retrieved', genres })
  } catch (error) {
    console.error('Error fetching genres:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

//@route  GET /api/book/genre/:category
//@desc   Get books by genre (category)
//@access Public
router.get('/genre/:category', async (req, res) => {
  const category = req.p0cvarams.category
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  try {
    const books = await Book.find({
      category: { $regex: new RegExp(`^${category}$`, 'i') },
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Book.countDocuments({
      category: { $regex: new RegExp(`^${category}$`, 'i') },
    })

    res.status(200).json({ message: 'Books retrieved by genre', books, total })
  } catch (error) {
    console.error('Error fetching books by genre:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})
