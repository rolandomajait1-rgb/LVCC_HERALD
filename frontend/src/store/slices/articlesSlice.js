import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import articleService from '../../services/articleService';

// Thunks
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (params, { rejectWithValue }) => {
    try {
      const data = await articleService.getArticles(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchArticle = createAsyncThunk(
  'articles/fetchArticle',
  async (identifier, { rejectWithValue }) => {
    try {
      const data = await articleService.getArticle(identifier);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (articleData, { rejectWithValue }) => {
    try {
      const data = await articleService.createArticle(articleData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async ({ id, articleData }, { rejectWithValue }) => {
    try {
      const data = await articleService.updateArticle(id, articleData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  async (id, { rejectWithValue }) => {
    try {
      await articleService.deleteArticle(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const likeArticle = createAsyncThunk(
  'articles/likeArticle',
  async (id, { rejectWithValue }) => {
    try {
      const data = await articleService.likeArticle(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    article: null,
    loading: false,
    error: null,
  },
  reducers: {
    setArticles: (state, action) => {
      state.articles = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Articles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Article
      .addCase(fetchArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.article = action.payload;
      })
      .addCase(fetchArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Article
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.articles.data.unshift(action.payload);
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Article
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.articles.data.findIndex(article => article.id === action.payload.id);
        if (index !== -1) {
          state.articles.data[index] = action.payload;
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Article
      .addCase(deleteArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.articles.data = state.articles.data.filter(article => article.id !== action.payload);
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Like Article
      .addCase(likeArticle.pending, (state) => {
        // Optionally handle loading state for like action
      })
      .addCase(likeArticle.fulfilled, (state, action) => {
        if (state.article && state.article.id === action.payload.id) {
          state.article.is_liked = action.payload.liked;
          state.article.interactions_count = action.payload.likes_count;
        }
        const index = state.articles.data.findIndex(article => article.id === action.payload.id);
        if (index !== -1) {
          state.articles.data[index].is_liked = action.payload.liked;
          state.articles.data[index].interactions_count = action.payload.likes_count;
        }
      })
      .addCase(likeArticle.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setArticles, setLoading, setError, clearError } = articlesSlice.actions;
export default articlesSlice.reducer;
