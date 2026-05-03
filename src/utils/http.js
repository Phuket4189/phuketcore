export async function fetchTextOrThrow(url, options) {
  const response = await fetch(url, options)
  const text = await response.text()

  if (!response.ok) {
    throw new Error(text || `Request failed with status ${response.status}`)
  }

  return text
}

export async function fetchJsonOrThrow(url, options) {
  const response = await fetch(url, options)
  const text = await response.text()

  let data = {}
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new Error(text || 'Invalid JSON response')
    }
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || text || `Request failed with status ${response.status}`)
  }

  return data
}
