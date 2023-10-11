export interface Order {
    id: number
    buyerId: string
    shipingAddress: ShipingAddress
    orderDate: string
    orderedItems: OrderedItem[]
    subtotal: number
    deliveryFee: number
    orderStatus: string
    total: number
  }
  
  export interface ShipingAddress {
    fullName: string
    address1: string
    address2: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  
  export interface OrderedItem {
    productId: number
    name: string
    pictureUrl: string
    price: number
    quantity: number
  }
  