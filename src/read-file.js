import fs from 'fs';

async function readFile(path) {
  try {
    return await fs.promises.readFile(path, 'utf-8');
  } catch (error) {
    throw new Error(error);
  }
}

function extractLinks(content) {
  const regex = /\[([^[\]]*?)]\((https?:\/\/[^\s?#.].\S*)\)/gm;

  const links = [
    ...content.matchAll(regex),
  ];

  return links.map(link => ({
    name: link[1],
    url: link[2],
  }));
}

export {
  readFile,
  extractLinks,
};



