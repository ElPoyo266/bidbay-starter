<script setup>
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

const { isAuthenticated, token } = useAuthStore();
const router = useRouter();
let errorMessage = ref("");
let spinner = ref(false);
let productData = {
  name: "",
  description: "",
  category: "",
  originalPrice: 0,
  pictureUrl: "",
  endDate: "",
};
async function addProduct() {
  errorMessage.value = false;
  spinner.value = true;
  try {
    const res = await fetch(`http://localhost:3000/api/products`, {
      method: "POST",
      body: JSON.stringify(productData),
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      // Si la soumission réussit, redirige vers la page du produit ajouté
      const product = await res.json();
      await router.push({
        name: "Product",
        params: { productId: product.id },
      });
    } else {
      // Si la soumission échoue, définissez le message d'erreur approprié
      errorMessage.value = "Une erreur s'est produite lors de l'ajout du produit.";
    }
  } catch (e) {
    // Gestion des erreurs de requête
    errorMessage.value = "Une erreur s'est produite lors de la requête.";
  } finally {
    spinner.value = false;
  }
}

if (!isAuthenticated.value) {
  router.push({ name: "Login" });
}

</script>

<template>
  <h1 class="text-center">Ajouter un produit</h1>

  <div class="row justify-content-center">
    <div class="col-md-6">
      <form @submit.prevent="addProduct">
        <div class="alert alert-danger mt-4" role="alert" data-test-error v-if="errorMessage">
          {{ errorMessage }}
        </div>

        <div class="mb-3">
          <label for="product-name" class="form-label"> Nom du produit </label>
          <input
            type="text"
            class="form-control"
            id="product-name"
            required
            data-test-product-name
            v-model="productData.name"
          />
        </div>

        <div class="mb-3">
          <label for="product-description" class="form-label">
            Description
          </label>
          <textarea
            class="form-control"
            id="product-description"
            name="description"
            rows="3"
            required
            data-test-product-description
            v-model="productData.description"
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="product-category" class="form-label"> Catégorie </label>
          <input
            type="text"
            class="form-control"
            id="product-category"
            required
            data-test-product-category
            v-model="productData.category"
          />
        </div>

        <div class="mb-3">
          <label for="product-original-price" class="form-label">
            Prix de départ
          </label>
          <div class="input-group">
            <input
              type="number"
              class="form-control"
              id="product-original-price"
              name="originalPrice"
              step="1"
              min="0"
              required
              data-test-product-price
              v-model="productData.originalPrice"
            />
            <span class="input-group-text">€</span>
          </div>
        </div>

        <div class="mb-3">
          <label for="product-picture-url" class="form-label">
            URL de l'image
          </label>
          <input
            type="url"
            class="form-control"
            id="product-picture-url"
            name="pictureUrl"
            required
            data-test-product-picture
            v-model="productData.pictureUrl"
          />
        </div>

        <div class="mb-3">
          <label for="product-end-date" class="form-label">
            Date de fin de l'enchère
          </label>
          <input
            type="date"
            class="form-control"
            id="product-end-date"
            name="endDate"
            required
            data-test-product-end-date
            v-model="productData.endDate"
          />
        </div>

        <div class="d-grid gap-2">
          <button
              type="submit"
              class="btn btn-primary"
              data-test-submit
              :disabled="spinner"
          >
          Ajouter le produit
            <span
              data-test-spinner
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              v-if="spinner"
            ></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
