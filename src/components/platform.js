(() => ({
  name: 'Platform',
  type: 'CONTENT_COMPONENT',
  allowedTypes: ['BODY_COMPONENT', 'CONTAINER_COMPONENT', 'CONTENT_COMPONENT'],
  orientation: 'VERTICAL',
  jsx: (() => {
    const { width, height, texture } = options;
    const { env } = B;
    const isDev = env === 'dev';
    const [xPos, setXPos] = useState(0);
    const [yPos, setYPos] = useState(0);
    const elRef = useRef(null);

    const PlatformComponent = (
      <div
        className={['platform', classes.platform].join(' ')}
        id="platform"
        data-width={width}
        data-height={height}
        data-x={xPos}
        data-y={yPos}
        data-texture={texture}
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
        backgroundImage: ({ options: { texture } }) => {
          return texture && `url("${texture}")`;
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        display: 'inline-block',
      },
    };
  },
}))();
