import findRevision from "./findRevision";

/**
 *
 * @method getVariants
 * @summary TODO:
 * @param {string} productOrVariantId - TODO:
 * @param {string} type - TODO:
 * @param {Object} collections - TODO:
 * @return {Promise<Object[]>} TODO:
 */
export default async function getVariants(proudctOrVariantId, collections, topOnly) {
  const { Products } = collections;
  const variants = [];

  const productVariants = await Products.find({
    ancestors: topOnly ? [proudctOrVariantId] : proudctOrVariantId,
    type: "variant",
    isDeleted: false
  }).toArray();

  await Promise.all(
    productVariants.map(async (variant) => {
      const revision = await findRevision(
        {
          documentId: variant._id
        },
        collections
      );

      if (revision && revision.documentData.isVisible) {
        variants.push(revision.documentData);
      } else if (!revision && variant.isVisible) {
        variants.push(variant);
      }
    })
  );
  return variants;
}