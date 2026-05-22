import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { StyleSheet } from 'react-native';

import { HomeIcon } from '@/components/icons/home-icon';
import { NotebookIcon } from '@/components/icons/notebook-icon';
import { ProfileIcon } from '@/components/icons/profile-icon';
import { BottomNavBar } from '@/components/navigation/bottom-nav-bar';
import { NavTabItem } from '@/components/navigation/nav-tab-item';

const TAB_SLOT = StyleSheet.create({
  home: {
    position: 'absolute',
    left: 4,
    width: 72,
  },
  notebooks: {
    position: 'absolute',
    left: 80,
    width: 88,
  },
  profile: {
    position: 'absolute',
    right: 4,
    width: 72,
  },
});

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <BottomNavBar>
          <TabTrigger name="index" href="/" asChild>
            <NavTabItem
              label="Home"
              slotStyle={TAB_SLOT.home}
              renderIcon={(color) => <HomeIcon size={24} color={color} />}
            />
          </TabTrigger>
          <TabTrigger name="notebooks" href="/notebooks" asChild>
            <NavTabItem
              label="Notebooks"
              slotStyle={TAB_SLOT.notebooks}
              renderIcon={(color) => <NotebookIcon size={24} color={color} />}
            />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <NavTabItem
              label="Profile"
              slotStyle={TAB_SLOT.profile}
              renderIcon={(color) => <ProfileIcon size={24} color={color} />}
            />
          </TabTrigger>
        </BottomNavBar>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
  },
});
