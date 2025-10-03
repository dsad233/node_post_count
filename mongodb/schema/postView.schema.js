import mongoose, { Schema } from 'mongoose';
import { v4 } from 'uuid';

const postView = new Schema({
  _id: {
    type: String,
    default: () => {
      return v4();
    },
  },
  postId: {
    type: Schema.Types.UUID,
    require: true,
  },
  view: {
    type: Schema.Types.BigInt,
    default: 0,
  },
});

export default mongoose.model('post_views', postView);
