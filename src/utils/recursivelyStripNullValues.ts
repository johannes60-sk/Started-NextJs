export default function recursivelyStripNullValues(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map(recursivelyStripNullValues);
    }
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, value]) => [key, recursivelyStripNullValues(value)])
      );
    }
    if (value !== null) {
      return value;
    }
  }



  //Dans la fonction ci-dessus, nous parcourons récursivement la structure de données 
  //et ne conservons les valeurs que si elles diffèrent de null. Cela fonctionne aussi bien pour les tableaux
  // que pour les objets simples.