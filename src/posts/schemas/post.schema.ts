import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({
  timestamps: true,
})
export class Post {
  @Prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 150,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000,
  })
  description: string;

  @Prop({
    required: true,
  })
  imageUrl: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  authorId: Types.ObjectId;

  @Prop({
    required: true,
  })
  authorName: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
