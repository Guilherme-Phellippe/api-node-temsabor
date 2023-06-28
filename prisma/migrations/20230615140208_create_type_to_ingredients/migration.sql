-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "type_prepare_mode" TEXT[] DEFAULT ARRAY['Principal']::TEXT[],
ADD COLUMN     "type_stuffing_ing" TEXT[] DEFAULT ARRAY['Recheio']::TEXT[];
