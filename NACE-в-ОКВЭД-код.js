const fs = require('fs');
const xlsx = require('xlsx');

// Загружаем файлы Excel
const naceWorkbook = xlsx.readFile("./NACE_Коды_перевод_в_ОКВЭД_2023.xlsx");
const barinovWorkbook = xlsx.readFile("./Belarus_Barinov.xlsx");

// Выбираем первый лист в каждом файле
const naceSheet = naceWorkbook.Sheets[naceWorkbook.SheetNames[0]];
const barinovSheet = barinovWorkbook.Sheets[barinovWorkbook.SheetNames[0]];

// Преобразуем листы в JSON
const naceData = xlsx.utils.sheet_to_json(naceSheet);
const barinovData = xlsx.utils.sheet_to_json(barinovSheet);

// Создаем словарь соответствий {NACE CODE: ОКВЭД}
const naceToOkvedMap = {};
naceData.forEach(row => {
    if (row["NACE CODE"] && row["ОКВЭД"]) {
        naceToOkvedMap[row["NACE CODE"].toString().trim()] = row["ОКВЭД"].toString().trim();
    }
});

// Функция замены NACE на ОКВЭД
const mapNaceToOkved = (naceCode) => {
    return naceToOkvedMap[naceCode] || ""; // Если нет соответствия, оставляем пустым
};

// Обновляем столбец "ОКВЭД" в barinovData
barinovData.forEach(row => {
    if (row["NACE"]) {
        row["ОКВЭД"] = mapNaceToOkved(row["NACE"].toString().trim());
    }
});

// Преобразуем данные обратно в Excel
const updatedSheet = xlsx.utils.json_to_sheet(barinovData);
barinovWorkbook.Sheets[barinovWorkbook.SheetNames[0]] = updatedSheet;

// Сохраняем обновленный файл
xlsx.writeFile(barinovWorkbook, "./Belarus_Barinov_Final.xlsx");

console.log("Файл успешно обновлен и сохранен!");