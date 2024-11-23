import { forwardRef, Fragment, memo } from "react";
import { Menu, MenuItems, MenuItem, Transition, MenuButton } from "@headlessui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "./";
import { cn } from "../../utils";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export const ActionButtons = memo(forwardRef(({buttons, className, large = true, small = true}, ref) => {
  const defaultClassName = small ? "hidden sm:flex sm:space-x-2" : "flex space-x-2";
  return (<>
    <div ref={ref} className={cn(defaultClassName, className)}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={button.variant}
          onClick={button.onClick}
          aria-label={button.ariaLabel}
        >
          <FontAwesomeIcon icon={button.icon} />
          {large && <span className="hidden xl:inline ml-2">{button.caption}</span>}
        </Button>
      ))}
    </div>

    {/* Mobile Dropdown */}
    {small && <Menu as="div" className="relative sm:hidden">
      <MenuButton className="btn btn-secondary">
        <FontAwesomeIcon icon={faBars} />
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {buttons.map((button, index) => (
            <MenuItem key={index}>
              <button
                onClick={button.onClick}
                className={`bg-gray-100 group flex w-full items-center px-4 py-2 text-sm text-${button.variant}-500`}
              >
                <FontAwesomeIcon icon={button.icon} className="mr-2" />
                {button.caption}
              </button>
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>}
  </>);
}));