import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeGenerator {
  private static readonly characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  generate(): string {
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += CodeGenerator.characters.charAt(
        Math.floor(Math.random() * CodeGenerator.characters.length),
      );
    }
    return result;
  }
}
