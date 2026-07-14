import { ImageObject } from "@/entities/image-object.entity";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface NotificationState {
  newImageObject: ImageObject | null;
}

const initialState: NotificationState = {
  newImageObject: null,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNewImageObject: (state, action: PayloadAction<ImageObject>) => {
      state.newImageObject = action.payload;
    },
  },
});

export const { setNewImageObject } = notificationSlice.actions;

export default notificationSlice.reducer;
