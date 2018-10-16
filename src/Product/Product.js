import React, { Component } from 'react'
import axios from 'axios'


class Product extends Component {
  state = {}
  async componentDidMount () {
    const urlParams = new URL(window.location.href).searchParams
    const barcode = urlParams.get('barcode')
    const storeId = urlParams.get('storeId')
    const url = `https://apidev.sllr.io/v2/upc?barCode=${barcode}&storeId=${storeId}`
    const response = await axios.get(url, {
      headers: {
        Authorization:'Bearer' +
          ' eyJ0eXAiOiJKV1QiLCJhbGciOiJIMjU2In0=.eyJleHBpcmVzSW4iOjEsImlkIjoiMTk1IiwiZXhwaXJlcyI6MTUzNjc2ODE1M30=.9PDeV5QcX/IDYE4/G1ONXQwT1J4x7H2uCBqEWD43Jg8='
      }
    })
    this.setState({product: response.data.product, upcId:response.data.upcId, barCode:response.data.barCode})
  }

  specificProp = label => (prop) => prop.upcId === this.state.upcId && prop.property.label === label

  findPrice = (props) => {
    const priceProp = this.specificProp('price')
    const prices =  props.filter(priceProp)
    if(prices.length) return `$${prices[0].value}`
    return null
  }

  findSize = (props) => {
    const sizeProp = this.specificProp('size')
    const sizes = props.filter(sizeProp)
    if (sizes.length) return `${sizes[0].value}`
    return null
  }

  render () {
    const {product}  = this.state
    return product ?
      <div id={'product'} style={styles.container}>
        <div style={styles.imageContainer}>
          <img style={styles.image} src={product.image.lg} alt="" />
        </div>
        <div style={styles.info}>
          <h1 style={styles.name}>{product.name}</h1>
          <div style={styles.price}>{this.findPrice(product.properties)}</div>
          <div style={styles.size}>{this.findSize(product.properties)}</div>
        </div>
    </div> : <div id={'loading'}>Loading</div>
  }
}

const styles = {
  container: {
    display:'flex',
    flex:1,
    flexDirection: 'row',
    alignContent:'center',
    justifyContent:'space-between',
    paddingLeft:'3%',
  },
  imageContainer:{
    flex:1
  },
  image:{
    maxHeight: '90vh'
  },
  info: {
    flex:3,
    display:'flex',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  name: {
    fontSize: '4em'
  },
  price: {
    fontSize: '3em'
  },
  size: {
    fontSize: '3em',
    color: 'gray'
  }
}


export default Product
