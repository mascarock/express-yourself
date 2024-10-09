const mockFileList = ["file1.csv", "file2.csv", "file3.csv"];

const getMockedFiles = (req, res) => {
    res.json({ files: mockFileList });
};

const getMockedFileByName = (req, res) => {
    const fileName = req.params.name;

    if (!mockFileList.includes(fileName)) {
        return res.status(404).json({ error: 'File not found' });
    }

    const fileContent = `file,text,number,hex\n${fileName},RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765`;

    res.setHeader('Content-Type', 'text/csv');
    res.send(fileContent);
};

module.exports = {
    getMockedFiles,
    getMockedFileByName
};
