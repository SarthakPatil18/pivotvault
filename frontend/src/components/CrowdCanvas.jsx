import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";

const CrowdCanvas = ({ src, rows = 15, cols = 7, className = "" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log("CrowdCanvas mounted");
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }
    console.log("Canvas ready");

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context not found");
      return;
    }

    // Utility functions
    const randomRange = (min, max) => min + Math.random() * (max - min);
    const randomIndex = (array) => randomRange(0, array.length) | 0;
    const removeFromArray = (array, i) => array.splice(i, 1)[0];
    const removeItemFromArray = (array, item) =>
      removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array) =>
      removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array) => array[randomIndex(array) | 0];

    // Process sprite sheet to only make white background transparent, preserve all other colors
    const processSpriteSheet = (originalImage) => {
      console.log(`Processing sprite sheet: ${originalImage.src}`);
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = originalImage.naturalWidth;
      offscreenCanvas.height = originalImage.naturalHeight;
      const offCtx = offscreenCanvas.getContext("2d");
      offCtx.drawImage(originalImage, 0, 0);
      
      const imageData = offCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Only make white background transparent
        if (r > 245 && g > 245 && b > 245) {
          data[i + 3] = 0;
        }
        // Leave all other colors as-is
      }

      offCtx.putImageData(imageData, 0, 0);
      const processedImg = new Image();
      processedImg.src = offscreenCanvas.toDataURL();
      return processedImg;
    };

    // Tween factories
    const resetPeep = ({ stage, peep }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX, endX;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;
      return { startX, startY, endX };
    };

    const normalWalk = ({ peep, props }) => {
      const { startX, startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(peep, { duration: xDuration, x: endX, ease: "none" }, 0);
      tl.to(peep, { duration: yDuration, repeat: xDuration / yDuration, yoyo: true, y: startY - 10 }, 0);
      return tl;
    };

    const walks = [normalWalk];

    // Peep factory
    const createPeep = ({ image, rect }) => {
      const peep = {
        image,
        rect: [...rect],
        width: rect[2],
        height: rect[3],
        drawArgs: [image, ...rect, 0, 0, rect[2], rect[3]],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        render: (ctx) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(...peep.drawArgs);
          ctx.restore();
        }
      };
      return peep;
    };

    // Main animation logic
    let processedImg = null;
    const stage = { width: 0, height: 0 };
    const allPeeps = [];
    const availablePeeps = [];
    const crowd = [];

    const createPeeps = () => {
      console.log("Creating peeps from sprite sheet");
      console.log(`Sprite dimensions: ${processedImg.naturalWidth} x ${processedImg.naturalHeight}`);
      const rectWidth = processedImg.naturalWidth / rows;
      const rectHeight = processedImg.naturalHeight / cols;
      console.log(`Sprite dimensions per peep: ${rectWidth} x ${rectHeight}`);

      for (let i = 0; i < rows * cols; i++) {
        allPeeps.push(
          createPeep({
            image: processedImg,
            rect: [
              (i % rows) * rectWidth,
              Math.floor(i / rows) * rectHeight,
              rectWidth,
              rectHeight
            ]
          })
        );
      }
      console.log(`Created ${allPeeps.length} peeps`);
    };

    const initCrowd = () => {
      console.log("Initializing crowd");
      while (availablePeeps.length) {
        addPeepToCrowd().walk.progress(Math.random());
      }
      console.log("Animation started");
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({ peep, stage })
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const removePeepFromCrowd = (peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(devicePixelRatio, devicePixelRatio);
      crowd.forEach((peep) => {
        peep.render(ctx);
      });
      ctx.restore();
    };

    const resize = () => {
      console.log("Resizing canvas");
      if (!canvas) return;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * devicePixelRatio;
      canvas.height = stage.height * devicePixelRatio;

      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);
      initCrowd();
    };

    const init = () => {
      console.log("CrowdCanvas init");
      createPeeps();
      resize();
      gsap.ticker.add(render);
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      console.log("Image loaded");
      processedImg = processSpriteSheet(img);
      processedImg.onload = () => {
        console.log("Processed image loaded");
        init();
      };
    };
    img.onerror = (err) => {
      console.error("Error loading image", err);
    };
    img.src = src;

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute bottom-0 w-full ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};

export { CrowdCanvas };
