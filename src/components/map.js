(() => ({
  name: 'Map',
  type: 'BODY_COMPONENT',
  allowedTypes: [
    'BODY_COMPONENT',
    'CONTAINER_COMPONENT',
    'CONTENT_COMPONENT',
    'LAYOUT_COMPONENT',
  ],
  orientation: 'VERTICAL',
  jsx: (() => {
    const { Children, env } = B;
    const isDev = env === 'dev';
    const isEmpty = children.length === 0;
    const isPristine = isEmpty && isDev;
    const { texture } = options;
    const [loaded, setLoaded] = useState(false);
    const loadedPlatforms = document.getElementsByClassName('platform');
    const levelElements = document.getElementsByClassName('level');
    const playerElement = document.getElementById('player');
    const loaderRef = useRef(null);
    const history = isDev ? null : useHistory();

    useEffect(() => {
      if (!isDev) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.canvas.height = document.body.clientHeight;
        ctx.canvas.width = document.body.clientWidth;
        const { width, height } = ctx.canvas;

        let player = {};

        if (playerElement) {
          player = {
            x: parseFloat(playerElement.dataset.x),
            y: parseFloat(playerElement.dataset.y),
            x_v: 0,
            y_v: 0,
            jump: true,
            height: parseFloat(playerElement.dataset.height),
            width: parseFloat(playerElement.dataset.width),
            texture: playerElement.dataset.texture,
          };
        }

        const keys = {
          right: false,
          left: false,
          up: false,
        };
        const gravity = 0.5;
        const friction = 0.7;
        const platforms = [];
        const levelChangers = [];

        const rendercanvas = () => {
          if (texture === '') {
            ctx.fillStyle = '#F0F8FF';
            ctx.fillRect(0, 0, width, height);
          } else {
            const background = new Image();
            background.src = texture;

            // Draw background in center, right, bottom and bottom-right
            ctx.drawImage(background, 0, 0, width, height);
            ctx.drawImage(background, width, 0, width, height);
            ctx.drawImage(background, 0, height, width, height);
            ctx.drawImage(background, width, height, width, height);
          }
        };

        const renderplayer = () => {
          ctx.fillStyle = '#F08080';
          ctx.fillRect(
            player.x - 20,
            player.y - 20,
            player.width,
            player.height,
          );
        };

        const createLevelChangers = () => {
          for (let i = 0; i < levelElements.length; i += 1) {
            if (
              parseFloat(levelElements[i].dataset.x) > 0 &&
              parseFloat(levelElements[i].dataset.y) > 0
            ) {
              levelChangers.push({
                x: parseFloat(levelElements[i].dataset.x),
                y: parseFloat(levelElements[i].dataset.y),
                width: parseFloat(levelElements[i].dataset.width),
                height: parseFloat(levelElements[i].dataset.height),
                texture: levelElements[i].dataset.texture,
                url: levelElements[i].dataset.url,
              });
            }
          }
        };
        const renderLevelChangers = () => {
          for (let i = 0; i < levelChangers.length; i += 1) {
            if (texture !== '') {
              const textureRender = new Image();
              textureRender.src = levelChangers[i].texture;

              ctx.drawImage(
                textureRender,
                levelChangers[i].x,
                levelChangers[i].y,
                levelChangers[i].width,
                levelChangers[i].height,
              );
            } else {
              ctx.fillStyle = '#000000';
              ctx.fillRect(
                levelChangers[i].x,
                levelChangers[i].y,
                levelChangers[i].width,
                levelChangers[i].height,
              );
            }
          }
        };

        const createplatforms = () => {
          platforms.push({
            x: 100,
            y: 200 + 50,
            width: 110,
            height: 15,
            texture:
              'https://assets.bettyblocks.com/0428e33459124f1fbf8d99bd3ce31386_assets/files/platform',
          });
          for (let i = 0; i < loadedPlatforms.length; i += 1) {
            if (
              parseFloat(loadedPlatforms[i].dataset.x) > 0 &&
              parseFloat(loadedPlatforms[i].dataset.y) > 0
            ) {
              platforms.push({
                x: parseFloat(loadedPlatforms[i].dataset.x),
                y: parseFloat(loadedPlatforms[i].dataset.y),
                width: parseFloat(loadedPlatforms[i].dataset.width),
                height: parseFloat(loadedPlatforms[i].dataset.height),
                texture: loadedPlatforms[i].dataset.texture,
              });
            }
          }
        };

        const renderplatforms = () => {
          for (let i = 0; i < platforms.length; i += 1) {
            const textureRender = new Image();
            textureRender.src = platforms[i].texture;

            ctx.drawImage(
              textureRender,
              platforms[i].x,
              platforms[i].y,
              platforms[i].width,
              platforms[i].height,
            );
          }
        };

        const keydown = (e) => {
          if (e.keyCode === 37) {
            keys.left = true;
          }
          if (e.keyCode === 38) {
            if (player.jump === false) {
              player.y_v = -10;
            }
          }
          if (e.keyCode === 39) {
            keys.right = true;
          }
        };
        const keyup = (e) => {
          if (e.keyCode === 37) {
            keys.left = false;
          }
          if (e.keyCode === 38) {
            if (player.y_v < -2) {
              player.y_v = -3;
            }
          }
          if (e.keyCode === 39) {
            keys.right = false;
          }
        };

        // Generic collision function
        const playerCollides = (object) => {
          if (
            object.x < player.x &&
            player.x < object.x + object.width &&
            object.y < player.y &&
            player.y < object.y + object.height
          ) {
            return true;
          }
          return false;
        };

        const loop = () => {
          // Camera
          ctx.resetTransform();
          ctx.translate(-player.x, -player.y + 250);
          ctx.scale(2, 2);

          // movement
          if (player.jump === false) {
            player.x_v *= friction;
          } else if (player.y_v < 10) {
            player.y_v += gravity;
          }
          player.jump = true;
          if (keys.left) {
            player.x_v = -2.5;
          }
          if (keys.right) {
            player.x_v = 2.5;
          }
          player.y += player.y_v;
          player.x += player.x_v;

          // Platform collision
          for (let p = 0; p < platforms.length; p += 1) {
            if (playerCollides(platforms[p])) {
              player.y = platforms[p].y;
              player.jump = false;
            }
          }

          // LevelChange collision
          for (let p = 0; p < levelChangers.length; p += 1) {
            if (playerCollides(levelChangers[p])) {
              history.push(levelChangers[p].url);
            }
          }

          rendercanvas();
          renderplayer();
          renderplatforms();
          renderLevelChangers();
          const frames = requestAnimationFrame(loop);

          // death / respawn
          if (player.y >= ctx.canvas.height) {
            console.log('You died');
            cancelAnimationFrame(frames);
            // TODO: death screen
            window.location.reload();
          }
        };
        if (!isDev) {
          document.addEventListener('keydown', keydown);
          document.addEventListener('keyup', keyup);
        }

        setTimeout(() => {
          createplatforms();
          createLevelChangers();
          loop();
          loaderRef.current.remove();
        }, 2000);
      }
    }, [loaded, children, Children, playerElement]);

    const ColumnComponent = (
      <div>
        <div
          className={[
            classes.design,
            isDev ? classes.visible : classes.hidden,
          ].join(' ')}
          data-component="map"
        >
          {(() =>
            children.length !== 0 ? (
              children
            ) : (
              <div
                className={[
                  isEmpty ? classes.empty : '',
                  isPristine ? classes.pristine : '',
                ].join(' ')}
              >
                {isPristine ? 'Column' : ''}
              </div>
            ))()}
        </div>
        <div>
          {!isDev && (
            <span className={classes.loader} ref={loaderRef}>
              Loading...
            </span>
          )}

          <canvas
            id="canvas"
            className={[
              classes.canvas,
              !isDev ? classes.visible : classes.hidden,
            ].join(' ')}
          />
        </div>
      </div>
    );

    useEffect(() => {
      setLoaded(true);
    }, [ColumnComponent]);
    return ColumnComponent;
  })(),
  styles: () => () => {
    return {
      canvas: {
        margin: '0 auto',
      },
      hidden: {
        position: 'absolute',
        opacity: '0',
        zIndex: '-1',
        pointerEvents: 'none',
      },
      design: {
        backgroundImage: ({ options: { texture } }) => {
          return texture && `url("${texture}")`;
        },
        backgroundSize: 'cover',
        width: '100%',
        height: '100%',
      },
      empty: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: ({ options: { columnHeight } }) =>
          columnHeight ? 0 : '4rem',
        height: '100%',
        width: '100%',
        fontSize: '0.75rem',
        color: '#262A3A',
        textTransform: 'uppercase',
        boxSizing: 'border-box',
      },
      pristine: {
        borderWidth: '0.0625rem',
        borderColor: '#AFB5C8',
        borderStyle: 'dashed',
        backgroundColor: '#F0F1F5',
      },
      loader: {
        margin: '0 auto',
        fontSize: '30px',
        width: '100%',
      },
    };
  },
}))();
