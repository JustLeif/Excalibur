/// <reference path="Sprite.ts" />

module ex {

   /**
    * Sprite Sheets
    *
    * Sprite sheets are a useful mechanism for slicing up image resources into
    * separate sprites or for generating in game animations. [[Sprite]]s are organized
    * in row major order in the `SpriteSheet`.
    */
   export class SpriteSheet {
      public sprites: Sprite[] = [];
      private internalImage: HTMLImageElement;

      /**
       * @param image     The backing image texture to build the SpriteSheet
       * @param columns   The number of columns in the image texture
       * @param rows      The number of rows in the image texture
       * @param spWidth   The width of each individual sprite in pixels
       * @param spHeight  The height of each individual sprite in pixels
       */
      constructor(public image: Texture, private columns: number, private rows: number, spWidth: number, spHeight: number) {
         this.internalImage = image.image;
         this.sprites = new Array(columns * rows);

         // TODO: Inspect actual image dimensions with preloading
         /*if(spWidth * columns > this.internalImage.naturalWidth){
            throw new Error("SpriteSheet specified is wider than image width");
         }

         if(spHeight * rows > this.internalImage.naturalHeight){
            throw new Error("SpriteSheet specified is higher than image height");
         }*/

         var i = 0;
         var j = 0;
         for (i = 0; i < rows; i++) {
            for (j = 0; j < columns; j++) {
               this.sprites[j + i * columns] = new Sprite(this.image, j * spWidth, i * spHeight, spWidth, spHeight);
            }
         }
      }

      /**
       * Create an animation from the this SpriteSheet by listing out the
       * sprite indices. Sprites are organized in row major order in the SpriteSheet.
       * @param engine   Reference to the current game [[Engine]]
       * @param indices  An array of sprite indices to use in the animation
       * @param speed    The number in milliseconds to display each frame in the animation
       */
      public getAnimationByIndices(engine: Engine, indices: number[], speed: number) {
         var images: Sprite[] = indices.map((index) => {
            return this.sprites[index];
         });

         images = images.map(function (i) {
            return i.clone();
         });
         return new Animation(engine, images, speed);
      }

      /**
       * Create an animation from the this SpriteSheet by specifing the range of
       * images with the beginning and ending index
       * @param engine      Reference to the current game Engine
       * @param beginIndex  The index to start taking frames
       * @param endIndex    The index to stop taking frames
       * @param speed       The number in milliseconds to display each frame in the animation
       */
      public getAnimationBetween(engine: Engine, beginIndex: number, endIndex: number, speed: number) {
         var images = this.sprites.slice(beginIndex, endIndex);
         images = images.map(function (i) {
            return i.clone();
         });
         return new Animation(engine, images, speed);
      }

      /**
       * Treat the entire SpriteSheet as one animation, organizing the frames in 
       * row major order.
       * @param engine  Reference to the current game [[Engine]]
       * @param speed   The number in milliseconds to display each frame the animation
       */
      public getAnimationForAll(engine: Engine, speed: number) {
         var sprites = this.sprites.map(function (i) {
            return i.clone();
         });
         return new Animation(engine, sprites, speed);
      }

      /**
       * Retreive a specific sprite from the SpriteSheet by its index. Sprites are organized
       * in row major order in the SpriteSheet.
       * @param index  The index of the sprite
       */
      public getSprite(index: number): Sprite {
         if (index >= 0 && index < this.sprites.length) {
            return this.sprites[index];
         }
      }
   }

   /**
    * SpriteFonts are a used in conjunction with a [[Label]] to specify
    * a particular bitmap as a font.
    */
   export class SpriteFont extends SpriteSheet {
      private spriteLookup: { [key: string]: number; } = {};
      private colorLookup: {[key: string]: Sprite[];} = {};
      private _currentColor: Color = Color.Black;

      /**
       * @param image           The backing image texture to build the SpriteFont
       * @param alphabet        A string representing all the characters in the image, in row major order.
       * @param caseInsensitve  Indicate whether this font takes case into account 
       * @param columns         The number of columns of characters in the image
       * @param rows            The number of rows of characters in the image
       * @param spWdith         The width of each character in pixels
       * @param spHeight        The height of each character in pixels
       */
      constructor(public image: Texture, private alphabet: string, private caseInsensitive: boolean, columns: number, rows: number, spWidth: number, spHeight: number) {
         super(image, columns, rows, spWidth, spHeight);
      }

      /**
       * Returns a dictionary that maps each character in the alphabet to the appropriate [[Sprite]].
       */
      public getTextSprites(): { [key: string]: Sprite; }{
         var lookup: { [key: string]: Sprite; } = {};
         for (var i = 0; i < this.alphabet.length; i++) {
            var char = this.alphabet[i];
            if (this.caseInsensitive) {
               char = char.toLowerCase();
            }
            lookup[char] = this.sprites[i].clone();
         }
         return lookup;
      }
   }
}