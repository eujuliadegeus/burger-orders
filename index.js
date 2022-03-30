const express = require('express')
const uuid = require('uuid')
const app = express()


app.use(express.json())

const orders = []

const checkUserId = (request, response, next) => {
    const {id} = request.params
    const index = orders.findIndex(order => order.id === id)
    if (index < 0) {
        return response.status(404).json({error:"Order not found"})
    }

    request.userIndex = index
    request.userId = id

    next()
}

app.post('/orders', (request, response) => {
    const {ordered, name, value} = request.body
    const status = 'In preparation'
    const order = { id: uuid.v4(), ordered, name, value, status}

    orders.push(order)

    return response.status(201).json(order) 
})

app.get('/orders', (request, response) => {
    return response.json({orders})
})

app.put('/orders/:id', checkUserId, (request, response) => {
    const id = request.userId 
    const index = request.userIndex
    const {ordered, name, value, status} = request.body
    const updatedOrder = { id, ordered, name, value, status}
    orders[index] = updatedOrder
    return response.json(updatedOrder)
})

app.delete('/orders/:id', checkUserId, (request, response) => {

    const index = request.userIndex
    orders.splice(index, 1)
    return response.status(201).json()

})

app.get('/orders/:id', checkUserId, (request, response) => {

    const index = request.userIndex
    const order = orders[index]
    return response.status('208').json(order)
})

app.patch('/orders/:id', checkUserId, (request, response) => {
    const index = request.userIndex
    const {id, ordered, name, value, status} = orders[index]
    const changeOrderStatus = { id, ordered, name, value, status: "Done"}
    orders[index] = changeOrderStatus
    return response.json(changeOrderStatus)
})

app.listen(3000, () => 
    {console.log('🙌')})