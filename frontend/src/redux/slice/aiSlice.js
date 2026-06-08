import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import aiApi from "../../api/aiApi";

export const fetchAiData = createAsyncThunk(
  "chat/getData",
  async ({ message, history }, { rejectWithValue }) => {
    try {
      const response = await aiApi.getAiData({ message, history });
      return { 
        userMessage: message, 
        aiResponse: response.data.response 
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "An error occurred." }
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  messages: [],
};

export const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAiData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAiData.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          role: "user",
          content: action.payload.userMessage,
        });
        state.messages.push({
          role: "model",
          content: action.payload.aiResponse,
        });
      })
      .addCase(fetchAiData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to get response.";
      });
  },
});

export const { clearChat } = aiSlice.actions;
export default aiSlice.reducer;