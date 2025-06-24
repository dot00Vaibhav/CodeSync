import React from 'react';

const COLORS = [
  '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
  '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
  '#f39c12', '#d35400', '#e67e22', '#e74c3c', '#c0392b'
];

const getColorFromName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % COLORS.length);
  return COLORS[index];
};

const InitialsAvatar = ({
  name = '',
  size = 48,
  textColor = 'white'
}) => {
  // 🔽 Add fallback here
  if (!name) return <div style={{
    width: size,
    height: size,
    backgroundColor: '#999',
    color: textColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: size / 2,
    borderRadius: '12px',
  }}>?</div>;

  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const backgroundColor = getColorFromName(name);

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor,
        color: textColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: size / 2,
        borderRadius: '12px',
        textTransform: 'uppercase'
      }}
    >
      {initials}
    </div>
  );
};

export default InitialsAvatar;
