async function checkUrl(url) {
  try {
    const response = await fetch(url);

    return {
      code: response.status,
      message: response.statusText,
    };
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error) {
  let message = error.message;

  if (error.cause.code === 'ENOTFOUND') {
    message = 'could not resolve host';
  }

  return { code: null, message };
}

async function validateLinks(links) {
  const validatedLinks = await links.map(async (link) => ({
    ...link,
    status: await checkUrl(link.url),
  }));

  return Promise.all(validatedLinks);
}

export {
  validateLinks,
};
