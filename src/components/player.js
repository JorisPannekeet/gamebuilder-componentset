(() => ({
  name: 'Player',
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

    const PlayerComponent = (
      <div
        className={['player', classes.platform].join(' ')}
        id="player"
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
        const element = elRef.current;
        setXPos(element.getBoundingClientRect().x);
        setYPos(element.getBoundingClientRect().y);
      }
    }, [elRef]);

    return PlayerComponent;
  })(),
  styles: () => () => {
    return {
      platform: {
        width: ({ options: { width } }) => `${width}px`,
        height: ({ options: { height } }) => `${height}px`,
        backgroundColor: '#F08080',
        display: 'inline-block',
      },
    };
  },
}))();
