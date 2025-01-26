export function replaceImageTags(html: string): string {
  return html.replace(
    /<img[^>]+src="\/api\/uploads\/([^"]+)"[^>]*>/g,
    (_, src) => {
      return `<native-img data-src="/api/uploads/${src}"></native-img>`;
    }
  );
}
