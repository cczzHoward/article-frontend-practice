export function normalizeId(data: any): any {
    if (Array.isArray(data)) return data.map(normalizeId);
    if (data !== null && typeof data === 'object') {
        const newObj = { ...data };
        if (newObj._id && !newObj.id) newObj.id = newObj._id;
        Object.keys(newObj).forEach((key) => {
            newObj[key] = normalizeId(newObj[key]);
        });
        return newObj;
    }
    return data;
}
