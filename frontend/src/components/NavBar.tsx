'use client';

import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Chip,
} from '@nextui-org/react';
import LogoutButton from './LogoutButton';
import Logo from './icons/LogoIcon';

interface typeItems {
  label: string;
  href: string;
}

export default function App({ user, role }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let nameRole = '';

  let menuItems: typeItems[] = [];

  if (role === 'ResponsibleRole') {
    menuItems = [
      { label: 'Roteiro', href: '/responsible/trips' },
      { label: 'Notificações', href: '/responsible/notification' },
    ];
    nameRole = 'Responsável';
  } else if (role === 'DriverRole') {
    menuItems = [
      { label: 'Roteiro', href: '/driver/trips' },
      { label: 'Estudantes', href: '/driver/student' },
      { label: 'Escolas', href: '/driver/school' },
      { label: 'Notificações', href: '/driver/notification' },
    ];
    nameRole = 'Motorista';
  } else if (role === 'StudentRole') {
    menuItems = [
      { label: 'Roteiro', href: '/student/trips' },
      { label: 'Notificações', href: '/student/notification' },
    ];
    nameRole = 'Estudante';
  }

  return (
    <Navbar className="fixed" isBordered onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
      </NavbarContent>
      {user && (
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItems.map((item, index) => (
            <NavbarItem key={index}>
              <Link color="foreground" href={item.href}>
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
      )}

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color="foreground"
              className="w-full"
              href={item.href}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      {user ? (
        <NavbarContent as="div" justify="end">
          <Chip className="hidden md:flex">Bem Vindo, {nameRole}</Chip>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="default"
                size="sm"
              />
            </DropdownTrigger>

            <DropdownMenu aria-label="Ações do perfil" variant="flat">
              <DropdownItem
                key="profile"
                className="h-14 gap-2"
                aria-label="Logado com email"
              >
                <p className="font-semibold">Logado com</p>
                <p className="font-semibold">{user.email}</p>
              </DropdownItem>
              {role && (
                <DropdownItem key="configurations" aria-label="Configurações">
                  <Link className="w-full" color="foreground" href="/account">
                    Configurações
                  </Link>
                </DropdownItem>
              )}
              <DropdownItem key="logout" aria-label="Sair">
                <LogoutButton />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem>
            <Link href="/auth/login">Login</Link>
          </NavbarItem>
        </NavbarContent>
      )}
    </Navbar>
  );
}
