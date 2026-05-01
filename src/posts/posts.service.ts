import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  findAll() {
    return this.postModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    const isValidId = Types.ObjectId.isValid(id);

    if (!isValidId) {
      throw new NotFoundException('Post not found');
    }

    const post = await this.postModel.findById(id).lean();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  findByAuthor(authorId: string) {
    return this.postModel
      .find({ authorId: authorId })
      .sort({ createdAt: -1 })
      .lean();
  }

  create(dto: CreatePostDto, user: AuthenticatedUser) {
    return this.postModel.create({
      title: dto.title,
      description: dto.description,
      imageUrl: dto.imageUrl,
      authorId: new Types.ObjectId(user.id),
      authorName: user.name,
    });
  }

  async update(id: string, dto: UpdatePostDto, userId: string) {
    const post = await this.findOne(id);

    if (String(post.authorId) !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();

    return updatedPost;
  }

  async remove(id: string, userId: string) {
    const post = await this.findOne(id);

    if (String(post.authorId) !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postModel.findByIdAndDelete(id);

    return {
      message: 'Post deleted successfully',
    };
  }
}
