import { Menu, MenuItem, MenuButton } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const DropdownMenu = ({ buttonLabel = 'Menu', items = [] }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {/* Menu Button */}
      <MenuButton className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <FontAwesomeIcon icon={faBars} className="mr-2" />
        {buttonLabel}
      </MenuButton>

      {/* Menu Items */}
      <MenuItems className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
        {items.map((item, index) => (
          <MenuItem key={index}>
            {({ active }) => (
              <button
                onClick={item.onClick}
                className={`${
                  active ? 'bg-gray-100' : ''
                } flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
              >
                {item.icon && <FontAwesomeIcon icon={item.icon} className="mr-2" />}
                {item.label}
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};

export default DropdownMenu;
