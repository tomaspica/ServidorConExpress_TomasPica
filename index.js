import fs from "fs"
import express from "express"

class container {
    constructor(fileName) {
        this.rutaArchivo = `./${fileName}.json`;
    }

    async getAll() {
        try {
            const file= await fs.promises.readFile(this.rutaArchivo, "utf8")
            const elements = JSON.parse(file);
            return elements;
        } catch (error) {
            console.log(error)
            if(error.code === "ENOENT")
            await fs.promises.writeFile(this.rutaArchivo, JSON.stringify([], null, 3));
            return [];
        }
    }

    async save(element) {
        try {
            const elements = await this.getAll();
            const id = elements.length === 0 ? 1 : elements[elements.length -1].id + 1;
            element.id = id;
            elements.push(element);
            await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(elements, null, 3));
        } catch (error) {
            console.log(error)
        }
    }

    async getById(id) {
        try {
            const elements = await this.getAll();
            const foundElement = elements.find((element) => element.id == id);
            if(!foundElement) return null;
            return foundElement;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id) {
        try {
            const elements = await this.getAll();
            const foundElement = elements.find((element) => element.id == id);
            if(!foundElement) return "Elemento no encontrado";
            const filterElements = elements.filter((element) => element.id != id);
            await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(filterElements, null, 3));
        } catch (error) {
            console.log(error)
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.rutaArchivo, JSON.stringify([], null, 3));
        } catch (error) {
            console.log(error)
        }        
    }

}

const ProductContainer = new container ("productos")

const app = express()
const PORT = process.env.PORT || 8080

app.get("/", (req, res) => {
    res.send("Bienvenido al servidor")
})

app.get("/productos", (req, res) => {
    ProductContainer.getAll()
    .then(lista => { res.send(lista)})
})

app.get("/productoRandom", (req, res) => {
    ProductContainer.getAll()
    .then(producto => {res.send(producto[Math.floor(Math.random() * producto.length)])})
})

const server = app.listen( PORT, () => console.log(`Server listening on PORT ${PORT}`))