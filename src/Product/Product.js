import React, { Component } from 'react'
import { apiClient } from '../apiClient'
import { Featured } from './Featured'

class Product extends Component {
  constructor() {
    super()
    this.state = {}
  }
  async componentDidMount() {
    const urlParams = new URL(window.location.href).searchParams
    const barcode = urlParams.get('barcode')
    const storeId = urlParams.get('storeId')
    const url = `/v2/upc?barCode=${barcode}&storeId=${storeId}`
    const response = await apiClient.get(url)
    this.setState({
      product: response.data.product,
      upcId: response.data.upcId,
      barCode: response.data.barCode
    })
  }

  specificProp = label => prop =>
    prop.upcId === this.state.upcId && prop.property.label === label

  findPrice = props => {
    const priceProp = this.specificProp('price')
    const saleProp = this.specificProp('Sale Price')

    const prices = props.filter(priceProp)
    const salePrices = props.filter(saleProp)
    if (salePrices.length)
      return (
        <div style={{ ...styles.price, ...styles.salePrice }}>
          {prices.length && (
            <span style={styles.oldPrice}>${prices[0].value}</span>
          )}
          ${salePrices[0].value}{' '}
        </div>
      )

    if (prices.length) return <div style={styles.price}>${prices[0].value}</div>
    return null
  }

  findSize = props => {
    const sizeProp = this.specificProp('size')
    const sizes = props.filter(sizeProp)
    if (sizes.length) return `${sizes[0].value}`
    return null
  }

  render() {
    const { product } = this.state
    return product ? (
      <>
        <Featured />
        <div id={'product'} style={styles.container}>
          <div style={styles.imageContainer}>
            <img style={styles.image} src={product.image.lg} alt="" />
          </div>
          <div style={styles.info}>
            <h1 style={styles.name}>{product.name}</h1>
            {this.findPrice(product.properties)}
            <div style={styles.size}>{this.findSize(product.properties)}</div>
          </div>
        </div>
      </>
    ) : (
      <div id={'loading'}>Loading</div>
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    height: '100vh',
    width: '100vw'
  },
  imageContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5%'
  },
  image: {
    maxHeight: '90vh',
    width: 'auto'
  },
  info: {
    flex: 3,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  name: {
    fontSize: '4em',
    color: '#2d3436',
    fontWeight: 900
  },
  price: {
    fontSize: '3em',
    color: '#2d3436'
  },
  oldPrice: {
    textDecoration: 'line-through #636e72',
    color: '#636e72',
    marginRight: '0.5em'
  },
  salePrice: {
    color: '#d63031'
  },
  size: {
    fontSize: '3em',
    color: '#2d3436',
    fontWeight: 300
  }
}

export default Product
