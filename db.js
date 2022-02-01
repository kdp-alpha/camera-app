let db;
//to open a database
let openRequest = indexedDB.open("myDB");
openRequest.addEventListener("success",(e) => {
    console.log("DB success")
    db = openRequest.result;
})
openRequest.addEventListener("error",(e) => {
    console.log("DB error")
})
openRequest.addEventListener("upgradeneeded",(e)=>{
    console.log("DB upgraded")
    db = openRequest.result;

    db.createObjectStore("video",{keyPath : "id"})
    db.createObjectStore("image",{keyPath : "id"})
    
})