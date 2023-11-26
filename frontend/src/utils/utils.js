export function buildPath(route) {
    if (process.env.NODE_ENV === "production") {
        return "https://www.toptier.games/" + route;
    } else {
        return "http://localhost:3001/" + route;
    }
}

export function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}


export function chunkArray(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}
  
export function doubleChunkArray(array, firstChunkSize, secondChunkSize) {
    const firstLevelChunks = chunkArray(array, firstChunkSize);
    return firstLevelChunks.map(subArray => chunkArray(subArray, secondChunkSize));
}



