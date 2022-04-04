(() => ({
  name: 'ChangeLevel',
  type: 'CONTENT_COMPONENT',
  allowedTypes: ['BODY_COMPONENT', 'CONTAINER_COMPONENT', 'CONTENT_COMPONENT'],
  orientation: 'VERTICAL',
  jsx: (() => {
    const { width, height, texture, url } = options;
    const { env } = B;
    const isDev = env === 'dev';
    const [xPos, setXPos] = useState(0);
    const [yPos, setYPos] = useState(0);
    const elRef = useRef(null);

    const PlatformComponent = (
      <div
        className={['level', classes.platform].join(' ')}
        id="level"
        data-width={width}
        data-height={height}
        data-x={xPos}
        data-y={yPos}
        data-texture={texture}
        data-url={url}
        ref={elRef}
      />
    );

    useEffect(() => {
      if (!isDev) {
        const platFormEl = elRef.current;
        setXPos(platFormEl.getBoundingClientRect().x);
        setYPos(platFormEl.getBoundingClientRect().y);
      }
    }, [elRef]);

    return PlatformComponent;
  })(),
  styles: () => () => {
    return {
      platform: {
        width: ({ options: { width } }) => `${width}px`,
        height: ({ options: { height } }) => `${height}px`,
        // backgroundColor: 'rgba(255,255,255, 0.5)',
        backgroundImage: ({ options: { texture } }) => {
          return texture && `url("${texture}")`;
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      },
    };
  },
}))();
