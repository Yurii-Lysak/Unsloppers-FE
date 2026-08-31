export const getSafePostLoginDestination = (
  requestedPath: string | undefined
): string => {
  if (!requestedPath?.startsWith('/') || requestedPath.startsWith('//')) {
    return '/'
  }

  const destination = new URL(requestedPath, window.location.origin)
  return destination.pathname === '/login' ? '/' : requestedPath
}
