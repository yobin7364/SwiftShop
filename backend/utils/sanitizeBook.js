export function sanitizeBook(book, user) {
  const isSeller = Array.isArray(user?.role) && user.role.includes('seller')
  const isOwner = user?.id && book.author?._id?.toString?.() === user.id

  const obj =
    typeof book.toObject === 'function' ? book.toObject() : { ...book }

  if (!isSeller && !isOwner) {
    delete obj.file
  }

  return obj
}
