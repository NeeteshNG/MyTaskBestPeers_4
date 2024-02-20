import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'

const useAppController = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [products, setProducts] = useState([])
  const [userCartInfo, setUserCartInfo] = useState([])
  const [userCartProducts, setUserCartProducts] = useState([])
  const [cartQuantity, setCartQuantity] = useState(0)
  const [userWishlistInfo, setUserWishlistInfo] = useState([])
  const [userWishlistProducts, setUserWishlistProducts] = useState([])
  const [wishlistQuantity, setWishlistQuantity] = useState(0)

  const user = JSON.parse(localStorage.getItem('user'))

  const fetchCartProducts = useCallback(
    async products => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          'http://127.0.0.1:8000/cartApi/cart-items/',
          {
            headers: {
              Authorization: `Token ${token}`
            }
          }
        )

        const userCartProductsInfo = response.data

        setUserCartInfo(response.data)

        const authUserIdInfo = userCartProductsInfo.filter(
          id_of => id_of.user === user.id
        )

        const filteredProducts = authUserIdInfo
          .map(info => {
            const product = products.find(item => item.id === info.product)
            if (product) {
              return { ...product, quantity: info.quantity }
            }
            return null
          })
          .filter(Boolean)

        setUserCartProducts(filteredProducts)
        setCartQuantity(filteredProducts.length)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    [user.id]
  )

  const fetchWishlistProducts = useCallback(
    async products => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          'http://127.0.0.1:8000/wishlistApi/wishlist-items/',
          {
            headers: {
              Authorization: `Token ${token}`
            }
          }
        )

        const userWishlistProductsInfo = response.data

        setUserWishlistInfo(response.data)

        const authUserIdInfo = userWishlistProductsInfo.filter(
          id_of => id_of.user === user.id
        )

        const filteredWishlistProducts = authUserIdInfo
          .map(info => {
            const product = products.find(item => item.id === info.product)
            if (product) {
              return { ...product }
            }
            return null
          })
          .filter(Boolean)

        setUserWishlistProducts(filteredWishlistProducts)
        setWishlistQuantity(filteredWishlistProducts.length)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    [user.id]
  )

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/productsApi/products/'
      )
      setProducts(response?.data)
      fetchCartProducts(response?.data)
      fetchWishlistProducts(response?.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }, [fetchCartProducts, fetchWishlistProducts])

  useEffect(() => {
    fetchProducts()

    const userIsLoggedIn = localStorage.getItem('loggedIn') === 'true'
    if (userIsLoggedIn) {
      setLoggedIn(true)
    }
  }, [fetchProducts])

  const removeItemFromCart = async productId => {
    try {
      const filteredProductInfo = userCartInfo.filter(
        info => info.product === productId
      )
      const token = localStorage.getItem('token')
      const cartItemId = filteredProductInfo[0].id

      await axios.delete(
        `http://127.0.0.1:8000/cartApi/cart-items/${cartItemId}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Token ${token}`
          }
        }
      )

      const updatedCart = userCartProducts.filter(item => item.id !== productId)
      setUserCartProducts(updatedCart)
      fetchCartProducts()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const incrementCartItemQuantity = async productId => {
    try {
      const filteredProductInfo = userCartInfo.filter(
        info => info.product === productId
      )
      const cartItemId = filteredProductInfo[0].id
      const token = localStorage.getItem('token')

      const incrementResponse = await fetch(
        `http://127.0.0.1:8000/cartApi/cart-items/${cartItemId}/increment/`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...filteredProductInfo,
            quantity: filteredProductInfo[0].quantity + 1
          })
        }
      )

      if (!incrementResponse.ok) {
        throw new Error('Failed to update cart item quantity')
      }

      const updatedCart = userCartProducts.map(item => {
        if (item.id === productId) {
          return { ...item, quantity: item.quantity + 1 }
        }
        return item
      })
      setUserCartProducts(updatedCart)
    } catch (error) {
      console.error('Error incrementing item quantity:', error)
    }
  }

  const decrementCartItemQuantity = async productId => {
    try {
      const filteredProductInfo = userCartInfo.filter(
        info => info.product === productId
      )
      const cartItemId = filteredProductInfo[0].id
      const token = localStorage.getItem('token')

      if (filteredProductInfo[0].quantity === 1) {
        return removeItemFromCart(productId)
      }

      const decrementResponse = await fetch(
        `http://127.0.0.1:8000/cartApi/cart-items/${cartItemId}/decrement/`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...filteredProductInfo,
            quantity: filteredProductInfo[0].quantity - 1
          })
        }
      )

      if (!decrementResponse.ok) {
        throw new Error('Failed to update cart item quantity')
      }

      const updatedCart = userCartProducts.map(item => {
        if (item.id === productId) {
          return { ...item, quantity: item.quantity - 1 }
        }
        return item
      })
      setUserCartProducts(updatedCart)
      fetchCartProducts()
    } catch (error) {
      console.error('Error decrementing item quantity:', error)
    }
  }

  const totalAmountOfCart =
    userCartProducts && userCartProducts.length > 0
      ? userCartProducts.reduce(
          (total, product) => total + product.price * product.quantity,
          0
        )
      : 0

  const toggleWishlist = async product => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('Token not available')
      return
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/wishlistApi/wishlist-items/?user=${user.id}&product=${product.id}`,
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      )

      const wishlistItemId = response.data[0]?.id
      if (wishlistItemId) {
        await axios.delete(
          `http://127.0.0.1:8000/wishlistApi/wishlist-items/delete/${wishlistItemId}/`,
          {
            headers: {
              Authorization: `Token ${token}`
            }
          }
        )
        console.log('Item removed from wishlist on the server')
      } else {
        await axios.post(
          'http://127.0.0.1:8000/wishlistApi/wishlist-items/',
          {
            product: product.id,
            user: user.id
          },
          {
            headers: {
              Authorization: `Token ${token}`
            }
          }
        )
        console.log('Item added to wishlist on the server')
      }
    } catch (error) {
      console.error('Error toggling wishlist item:', error)
    }
  }

  return {
    loggedIn,
    products,
    cartQuantity,
    userCartInfo,
    userCartProducts,
    setLoggedIn,
    setProducts,
    setCartQuantity,
    setUserCartInfo,
    setUserCartProducts,
    fetchProducts,
    fetchCartProducts,
    removeItemFromCart,
    incrementCartItemQuantity,
    decrementCartItemQuantity,
    totalAmountOfCart,
    toggleWishlist,
    userWishlistProducts,
    userWishlistInfo,
    wishlistQuantity
  }
}

export default useAppController
