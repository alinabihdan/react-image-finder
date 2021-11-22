export default async function fetchImages(query, page) {
  const response = await fetch(
    `https://pixabay.com/api/?q=${query}&page=${page}&key=22289031-1611b833cc5adb7f34a3078c9&image_type=photo&orientation=horizontal&per_page=12`,
  );
  if (response.ok) {
    return response.json();
  }
  return await Promise.reject(new Error('Something went wrong'));
}
