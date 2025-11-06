import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateDeliverableFileInput } from './create-deliverable-file.input';

@InputType()
export class UpdateDeliverableFileInput extends PartialType(CreateDeliverableFileInput) {
  @Field(() => ID)
  id: string; // L'ID est requis pour la mise à jour
}
