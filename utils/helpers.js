import * as fs from "fs";
const dataFilePath = './data.json';
let data = {};


export const loadData = () => {
    try {
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        const parsedData = JSON.parse(fileData);
        if (!Array.isArray(parsedData)) {
            throw new Error('Data format is incorrect');
        }
        return parsedData;
    } catch (error) {
        return [];
    }
};

export const saveData = (data) => {
    if (!Array.isArray(data)) {
        throw new Error('Data must be an array');
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

export const applyFiltersAndSort= (query)=>{
    let filteredData = Object.values(data);

    if (query.name) {
        filteredData = filteredData.filter(item =>
            item.name.toLowerCase().includes(query.name.toLowerCase())
        );
    }

    if (query.age) {
        filteredData = filteredData.filter(item =>
            item.age === parseInt(query.age)
        );
    }

    if (query.country) {
        filteredData = filteredData.filter(item =>
            item.country.toLowerCase().includes(query.country.toLowerCase())
        );
    }

    if (query.sort === "age") {
        filteredData.sort((a, b) => a.age - b.age);
    }

    return filteredData;
}