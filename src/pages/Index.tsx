import { ChatContainer } from '@/components/ChatContainer';
import { AppSidebar } from '@/components/AppSidebar';

const Index = () => {
  return (
    <>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <ChatContainer />
        </main>
        
        {/* Sidebar with Exercises & Music */}
        <AppSidebar className="hidden md:flex" />
      </div>
    </>
  );
};

export default Index;
