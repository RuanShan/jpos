export const te310_20x50_barcode_label_tspl = `SIZE 20 mm, 50 mm
SET RIBBON ON
DIRECTION 0,0
REFERENCE 0,0
OFFSET 0 mm
DENSITY 4
SPEED 1.5
SET TEAR OFF
SET PEEL OFF
SET PARTIAL_CUTTER OFF
SET CUTTER 1
CLS
PUTBMP 13,310,"logo.BMP",8,80
BARCODE 13,300,"128M",85,2,270,3,6,"!105<%=group_number%>"
BLOCK 133,576,560,120,"FONT001",270,2,2,8,"<%=item_memos%>"
BAR 4,590,240,1

PRINT 1,1`
