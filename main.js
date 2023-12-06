document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    const totalPriceElement = document.getElementById('totalPrice');
    const API_URL = 'https://crudcrud.com/api/7854cbe643af496bb0a28ea1689b99be';
    let products = JSON.parse(localStorage.getItem('products')) || [];
  
    // Function to display products in the table
    function displayProducts() {
      productList.innerHTML = '';
      let totalPrice = 0;
  
      products.forEach((product, index) => {
        const row = `
          <tr>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>
              <button class="btn btn-sm btn-primary edit-btn" data-index="${index}">Edit</button>
              <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
            </td>
          </tr>
        `;
        productList.innerHTML += row;
        totalPrice += parseFloat(product.price);
      });
  
      totalPriceElement.textContent = `Total Price: ${totalPrice}`;
    }
  
    // Display existing products
    displayProducts();
  
    // Function to handle form submission
    productForm.addEventListener('submit', async function(event) {
      event.preventDefault();
  
      const productName = document.getElementById('productName').value;
      const productPrice = document.getElementById('productPrice').value;
  
      if (productName && productPrice) {
        const newProduct = {
          name: productName,
          price: productPrice
        };
  
        try {
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
          });
  
          if (response.ok) {
            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));
            displayProducts();
            productForm.reset();
          } else {
            alert('Failed to add the product.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while adding the product.');
        }
      } else {
        alert('Please enter both product name and price.');
      }
    });
  
    // Function to handle edit and delete buttons
    productList.addEventListener('click', async function(event) {
      if (event.target.classList.contains('edit-btn')) {
        const index = event.target.getAttribute('data-index');
        const productToEdit = products[index];
  
        document.getElementById('productName').value = productToEdit.name;
        document.getElementById('productPrice').value = productToEdit.price;
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
      }
  
      if (event.target.classList.contains('delete-btn')) {
        const index = event.target.getAttribute('data-index');
        const productToDelete = products[index];
  
        try {
            const response = await fetch(`${API_URL}/products/${productToDelete._id}`, {
                method: 'DELETE'
              });
  
          if (response.ok) {
            products.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(products));
            displayProducts();
          } else {
            alert('Failed to delete the product.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while deleting the product.');
        }
      }
    });
  });
  