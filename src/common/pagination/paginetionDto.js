export function PagenationDto(page, pages) {
  const nowPage = page ? Number(page) : 1;
  const perPage = pages ? Number(pages) : 10;
  return {
    page: nowPage,
    pages: perPage,
  };
}

export function getPage(page) {
  return page;
}

export function getPages(pages) {
  return pages;
}

export function perPage(page, pages) {
  return (page - 1) * pages;
}

export function totalPage(page, pages) {
  return Math.ceil(pages / page);
}
