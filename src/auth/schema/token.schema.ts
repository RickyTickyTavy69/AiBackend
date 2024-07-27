import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Schema as MongooseSchema, Types} from 'mongoose';

@Schema()
export class Token{
  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'User'})
  User: Types.ObjectId;
  @Prop({required: true})
  refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token)
