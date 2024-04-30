import express from 'express';
import fs from "fs";
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());


const leerDatos = () => {
    try {
        const datos = fs.readFileSync("./db.json");
        return (JSON.parse(datos));
    } catch (error) {
        console.log(error);
    }
};

const escribirDatos= (datos)=> {
    try {
       fs.writeFileSync("./db.json", JSON.stringify(datos));
    } catch (error) {
        console.log(error);
    }

}



app.get("/", (req, res) => {
    res.send(leerDatos())
})

app.get("/books", (req,res)=> {
    const datos=leerDatos();
    res.json(datos.books);
});

app.get("/books/:id", (req,res)=> {
    const datos=leerDatos();
    const id=parseInt(req.params.id);
    const libro= datos.books.find((libro) => libro.id === id);
    res.json(libro);
})

app.post("/books", (req,res)=>{
    const datos= leerDatos();
    const body= req.body;
    const newLibro= {
        id: datos.books.length +1,
        ...body,
    };
    datos.books.push(newLibro);
    escribirDatos(datos);
    res.json(newLibro)
});

app.put("/books/:id", (req,res)=>{
    const datos= leerDatos();
    const body= req.body;
    const id=parseInt(req.params.id);
    const libroIndex = datos.books.findIndex((books)=> books.id===id);
    datos.books[libroIndex]={
        ...datos.books[libroIndex],
        ...body,
    };
    escribirDatos(datos);
    res.json({message: "El libro fue actualizado correctamente"});

});

app.delete("/books/:id", (req,res)=> {
    const datos= leerDatos();
    const id=parseInt(req.params.id);
    const libroIndex = datos.books.findIndex((books)=> books.id===id);
    datos.books.splice(libroIndex,1);
    escribirDatos(datos);
    res.json({message: "el libro fue borrado"})

});

app.listen(3005, () => {
    console.log('server listening on port 3005')
});

