const pdfList = []
function uploadPDF(originalname,name, room,URL){
    const pdf = {
        originalname,
        name,
        room,
        URL
    }
    pdfList.push(pdf)

}
function getRoomPDFList(room){
    return pdfList.filter(pdf=> pdf.room === room);
}
module.exports = {
    uploadPDF,
    getRoomPDFList
}