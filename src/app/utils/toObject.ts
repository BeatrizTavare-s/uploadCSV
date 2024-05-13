import { Item } from "@prisma/client";
export default function toObject(item:Item) {
    return JSON.parse(JSON.stringify(item, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value 
    ));
}