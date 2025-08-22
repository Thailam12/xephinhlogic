function PuzzleCanvas() {
  const canvasRef = React.useRef(null);
  const [tiles, setTiles] = React.useState(shuffleTiles());

  const TILE_SIZE = 100;
  const GRID_SIZE = 3;
  const startPos = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    drawTiles(ctx, tiles);

    // Lắng nghe bàn phím
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [tiles]);

  function drawTiles(ctx, tiles) {
    ctx.clearRect(0, 0, TILE_SIZE * GRID_SIZE, TILE_SIZE * GRID_SIZE);
    tiles.forEach((val, i) => {
      const x = (i % GRID_SIZE) * TILE_SIZE;
      const y = Math.floor(i / GRID_SIZE) * TILE_SIZE;
      if (val !== 0) {
        ctx.fillStyle = '#3498db';
        ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        ctx.fillStyle = '#fff';
        ctx.font = '40px Arial';
        ctx.fillText(val, x + 35, y + 65);
      }
    });
  }

  function moveTile(index) {
    const emptyIndex = tiles.indexOf(0);
    const validMoves = [
      emptyIndex - 1, emptyIndex + 1,
      emptyIndex - GRID_SIZE, emptyIndex + GRID_SIZE
    ];
    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
    }
  }

  // Click chuột
  function handleClick(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
    const index = y * GRID_SIZE + x;
    moveTile(index);
  }

  // Vuốt chạm mobile
  function handleTouchStart(e) {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
  }
  function handleTouchEnd(e) {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startPos.current.x;
    const dy = touch.clientY - startPos.current.y;

    const emptyIndex = tiles.indexOf(0);
    let targetIndex = null;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20) targetIndex = emptyIndex - 1;      // Vuốt phải → di chuyển ô bên trái
      else if (dx < -20) targetIndex = emptyIndex + 1;// Vuốt trái  → di chuyển ô bên phải
    } else {
      if (dy > 20) targetIndex = emptyIndex - GRID_SIZE; // Vuốt xuống
      else if (dy < -20) targetIndex = emptyIndex + GRID_SIZE; // Vuốt lên
    }

    if (targetIndex !== null && targetIndex >= 0 && targetIndex < tiles.length) {
      moveTile(targetIndex);
    }
  }

  // Điều khiển bàn phím
  function handleKey(e) {
    const emptyIndex = tiles.indexOf(0);
    let targetIndex = null;
    switch (e.key.toLowerCase()) {
      case "arrowleft":
      case "a": targetIndex = emptyIndex + 1; break;
      case "arrowright":
      case "d": targetIndex = emptyIndex - 1; break;
      case "arrowup":
      case "w": targetIndex = emptyIndex + GRID_SIZE; break;
      case "arrowdown":
      case "s": targetIndex = emptyIndex - GRID_SIZE; break;
    }
    if (targetIndex !== null && targetIndex >= 0 && targetIndex < tiles.length) {
      moveTile(targetIndex);
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={TILE_SIZE * GRID_SIZE}
      height={TILE_SIZE * GRID_SIZE}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    />
  );
}